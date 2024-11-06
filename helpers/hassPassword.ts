import bcrypt from "bcrypt";
export const hashPassword = async (password) => {
  try {
    // Kiểm tra nếu password không phải là chuỗi hoặc là chuỗi rỗng
    if (!password || typeof password !== 'string') {
      throw new Error("Password must be a non-empty string");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds); 
    const hash = await bcrypt.hash(password, salt); 
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error.message);
  }
};
