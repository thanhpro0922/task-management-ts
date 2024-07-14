import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect success");
    } catch (error) {
        console.log("connect error");
    }
};

//! Giải thích chỗ Promise<void>. Hàm này ko ko return về gì nên dùng kiểu void, nhưng cs dùng async thì đây là Promise nên để là Promise<void>
