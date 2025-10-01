import { Router } from 'express';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '../../lib/prisma';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId; // Replace with JWT/session user ID
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // generate TOTP secret
    const secret = authenticator.generateSecret();

    // store secret in DB
    await prisma.user.update({
      where: { id: userId },
       data: { mfaSecret: secret, mfaEnabled: false },
    });

    // generate QR code URI for Google Authenticator
    const otpauth = authenticator.keyuri(user.email, 'MyApp', secret);
    const qr = await QRCode.toDataURL(otpauth);

    res.json({ qr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
