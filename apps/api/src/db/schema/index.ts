import * as users from './user.schema';
import * as resturants from './resturants.schema';
import * as menuItems from './menu.schema';
import * as orders from './orders.schema';
import * as reviews from './reviews.schema';

export default {
  ...users,
  ...resturants,
  ...menuItems,
  ...orders,
  ...reviews,
};
