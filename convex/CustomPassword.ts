import { Password } from '@convex-dev/auth/providers/Password';
import { ConvexError } from 'convex/values';
import { z } from 'zod';

import { DataModel } from './_generated/dataModel';

const ParamsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

export default Password<DataModel>({
  profile(params) {
    const result = ParamsSchema.safeParse(params);
    if (!result.success) {
      throw new ConvexError(result.error.format());
    }
    return {
      email: result.data.email,
      name: result.data.name,
    };
  },
});
