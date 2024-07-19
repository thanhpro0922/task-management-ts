import { Request, Response } from "express";
import md5 from "md5";
import User from "../model/user.model";
import { generateRandomString } from "../../../helpers/generate";

//% [POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
    const mailExist = await User.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (mailExist) {
        res.json({
            code: 400,
            message: "Email đã tồn tại!",
        });
    } else {
        req.body.password = md5(req.body.password);

        req.body.token = generateRandomString(30);

        const user = new User(req.body);
        const data = await user.save();

        const token = data.token;

        res.json({
            code: 200,
            message: "Tạo tài khoản thành công!",
            token: token,
        });
    }
};

//% [POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email ko ton tai",
        });
        return;
    }

    if (md5(password) !== user.password) {
        res.json({
            code: 400,
            message: "Sai pass",
        });
        return;
    }

    const token = user.token;

    res.json({
        code: 200,
        message: "Đăng nhập thành công!",
        token: token,
    });
};

//% [POST] /api/v1/users/detail/:id

export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const user = await User.findOne({
        _id: id,
        deleted: false,
    }).select("-password -token");

    res.json({
        code: 200,
        info: user,
    });
};
