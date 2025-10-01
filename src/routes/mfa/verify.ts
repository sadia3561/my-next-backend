import { Router } from 'express';
import { authenticator } from 'otplib';
import { prisma } from '../../lib/prisma';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { userId, token } = req.body; // Replace with JWT/session user ID
    if (!userId || !token) return res.status(400).json({ error: 'Missing parameters' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) return res.status(404).json({ error: 'MFA not setup' });

    // verify OTP
    const isValid = authenticator.check(token, user.mfaSecret);
    if (!isValid) return res.status(401).json({ error: 'Invalid OTP' });

    // mark MFA as enabled
    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
