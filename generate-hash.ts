import * as bcrypt from 'bcrypt';

async function main() {
  const password = "Admin@123"; // jo password tumhe rakhna hai
  const hashed = await bcrypt.hash(password, 10);
  console.log("Plain password:", password);
  console.log("Hashed password:", hashed);
}

main();
