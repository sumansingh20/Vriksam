import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

interface ValidateOptions {
  /** Which part of the request to validate. Defaults to 'body'. */
  target?: ValidationTarget;
  /** If true, strips unknown keys from the validated data. Defaults to true. */
  stripUnknown?: boolean;
}

/**
 * Validation middleware factory using Zod schemas.
 *
 * Usage:
 *   router.post('/users', validate(createUserSchema), handler);
 *   router.get('/users', validate(listUsersQuerySchema, { target: 'query' }), handler);
 *   router.get('/users/:id', validate(userIdParamSchema, { target: 'params' }), handler);
 */
export const validate = (
  schema: ZodSchema,
  options: ValidateOptions | ValidationTarget = 'body'
) => {
  const opts: ValidateOptions = typeof options === 'string'
    ? { target: options }
    : options;
  const target = opts.target ?? 'body';

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[target]);

      // Replace the request property with the parsed (and potentially transformed) data
      if (target === 'body') {
        req.body = parsed;
      } else if (target === 'query') {
        (req as unknown as Record<string, unknown>).query = parsed;
      } else if (target === 'params') {
        (req as unknown as Record<string, unknown>).params = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};

        for (const issue of error.errors) {
          const path = issue.path.length > 0 ? issue.path.join('.') : '_root';
          if (!fieldErrors[path]) {
            fieldErrors[path] = [];
          }
          fieldErrors[path].push(issue.message);
        }

        res.status(400).json({
          success: false,
          error: 'Validation failed.',
          details: fieldErrors,
        });
        return;
      }

      res.status(400).json({
        success: false,
        error: 'Invalid request data.',
      });
    }
  };
};

/**
 * Compound validator: validate multiple targets in one middleware call.
 *
 * Usage:
 *   router.put('/users/:id',
 *     validateMany({ params: userIdSchema, body: updateUserSchema }),
 *     handler
 *   );
 */
export const validateMany = (
  schemas: Partial<Record<ValidationTarget, ZodSchema>>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const allErrors: Record<string, Record<string, string[]>> = {};

    for (const [target, schema] of Object.entries(schemas) as Array<[ValidationTarget, ZodSchema]>) {
      try {
        const parsed = schema.parse(req[target]);
        if (target === 'body') {
          req.body = parsed;
        } else if (target === 'query') {
          (req as unknown as Record<string, unknown>).query = parsed;
        } else if (target === 'params') {
          (req as unknown as Record<string, unknown>).params = parsed;
        }
      } catch (error) {
        if (error instanceof ZodError) {
          const fieldErrors: Record<string, string[]> = {};
          for (const issue of error.errors) {
            const path = issue.path.length > 0 ? issue.path.join('.') : '_root';
            if (!fieldErrors[path]) {
              fieldErrors[path] = [];
            }
            fieldErrors[path].push(issue.message);
          }
          allErrors[target] = fieldErrors;
        }
      }
    }

    if (Object.keys(allErrors).length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation failed.',
        details: allErrors,
      });
      return;
    }

    next();
  };
};
