import { userRegisterSchema } from "src/common/validations/user-register.validation";
import { UsersService } from "../services/users.service";
import { JsonResponse } from "src/lib/responses/json-response";
import { Request, Response } from "express";
import { asyncHandler } from "@helpers/async-handler";
import { bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Prefix } from "@lib/decorators/prefix.decorator";

@Prefix("/console/users")
export class AdminUsersController extends BaseController {
  private usersService: UsersService = new UsersService();

  setRoutes() {
    this.router.post(
      "/create",
      bodyValidator(userRegisterSchema),
      asyncHandler(this.create)
    );
  }

  create = async (req: Request, res: Response) => {
    let user = await this.usersService.create(req.body);
    const response = new JsonResponse({
      data: user,
    });
    return res.json(response);
  };
}