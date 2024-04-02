import { ExerciseSerialization } from "@common/serializers/exercise.serialization";
import { asyncHandler } from "@helpers/async-handler";
import { parsePaginationQuery } from "@helpers/pagination";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { Prefix } from "@lib/decorators/prefix.decorator";
import { JsonResponse } from "@lib/responses/json-response";
import { AdminGuardMiddleware } from "modules/console/common/guards/admins.guard";
import { ExercisesService } from "../services/exercises.service";
import { Request, Response } from "express";
import { serialize } from "@helpers/serialize";
import { createExerciseSchema } from "../validations/create-excercise.validation";
import { updateExerciseSchema } from "../validations/update-excercise.validation";

@Prefix("/console/exercises")
@ControllerMiddleware(AdminGuardMiddleware({}))
export class ExercisesController extends BaseController {
  private exercisesService = new ExercisesService();

  setRoutes() {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    this.router.post(
      "/",
      bodyValidator(createExerciseSchema),
      asyncHandler(this.create)
    );
    this.router.patch(
      "/:id",
      paramsValidator("id"),
      bodyValidator(updateExerciseSchema),
      asyncHandler(this.update)
    );
    this.router.delete(
      "/:id",
      paramsValidator("id"),
      asyncHandler(this.delete)
    );
  }

  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.exercisesService.list(
      {},
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, ExerciseSerialization),
        meta: paginationData,
      },
      res
    );
  };

  get = async (req: Request, res: Response) => {
    const data = await this.exercisesService.findOneOrFail({
      _id: req.params.id,
    });
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), ExerciseSerialization),
      },
      res
    );
  };

  create = async (req: Request, res: Response) => {
    const data = await this.exercisesService.create(req.body);
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), ExerciseSerialization),
      },
      res
    );
  };

  update = async (req: Request, res: Response) => {
    const data = await this.exercisesService.updateOne(
      { _id: req.params.id },
      req.body
    );
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), ExerciseSerialization),
      },
      res
    );
  };

  delete = async (req: Request, res: Response) => {
    await this.exercisesService.deleteOne({ _id: req.params.id });
    return JsonResponse.success({}, res);
  };
}