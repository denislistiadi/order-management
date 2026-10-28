/**
 * Generic request validation middleware using Zod schemas.
 */

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

type RequestSource = 'body' | 'query' | 'params';

/**
 * Higher-order middleware function to validate incoming request data against a Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @param source - Part of request to validate ('body' | 'query' | 'params')
 */
export function validate(schema: AnyZodObject, source: RequestSource = 'body') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default validate;
