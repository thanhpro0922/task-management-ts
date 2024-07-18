import { Request, Response } from "express";

import Task from "../model/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

export const index = async (req: Request, res: Response) => {
    //% Find
    interface Find {
        deleted: boolean;
        status?: string;
        title?: RegExp;
    }
    const find: Find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status.toString(); //! hoặc dùng như này thì bỏ interface, find["status"] = req.query.status;
    }
    //% End Find

    //% Search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }

    //% Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 2,
    };
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    );

    //% Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey.toString()] = req.query.sortValue;
    }
    //% End Sort
    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const task = await Task.find({
        _id: id,
        deleted: false,
    });
    res.json(task);
};

export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;

        const status: string = req.body.status;

        await Task.updateOne({ _id: id }, { status: status });
        res.json({
            code: 200, //@@ 200 có nghĩa là thành công, để cho ô FE biết thành công và làm gì đó
            message: "Cập nhật trạng thái thành công!",
        });
    } catch (error) {
        res.json({
            code: 400, //@@ 400 có nghĩa là lỗi, để cho ô FE biết thành công và làm gì đó
            message: "Không tồn tại!",
        });
    }
};

//% [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.ids;
        const key: string = req.body.key;
        const value: string = req.body.value;

        switch (key) {
            case "status":
                await Task.updateMany(
                    {
                        _id: { $in: ids },
                    },
                    {
                        status: value,
                    }
                );
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!",
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!",
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!",
        });
    }
};

//% [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
    try {
        const product = new Task(req.body);

        const data = await product.save();

        res.json({
            code: 200,
            message: "Tạo thành công!",
            data: data,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
};
