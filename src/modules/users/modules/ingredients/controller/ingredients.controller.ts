import { IngredientsService } from "../services/ingredients.service";
import { IngredientSerialization } from "@common/serializers/ingredient.serialization";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";


@Controller("/user/ingredients")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersIngredientsController extends BaseController {
  private ingredientsService = new IngredientsService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
  }

  @SwaggerGet()
  @SwaggerResponse([IngredientSerialization])
  @SwaggerSummary("list ingredients")
  @SwaggerDescription("List all ingredients")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
    filterName: "string",
    filterVal: "string"
  })
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);

    let filterName = req.query.filterName, filterVal = req.query.filterVal;
    let filter = {};

    if (filterName && filterVal) {
      filter[`${filterName}`] = filterVal;
    }

    const { docs, paginationData } = await this.ingredientsService.list(
      filter,
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, IngredientSerialization),
        meta: paginationData,
      },
      res
    );
  };
}
