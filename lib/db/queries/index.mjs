import messageQueries from './message.mjs'
import removalApplicationQueries from './removalApplication.mjs'
import wasteTypeQueries from './wasteType.mjs'
import userQueries from './user.mjs'
import userRoleQueries from './userRole.mjs'

export default {
  message: messageQueries,
  removalApplication: removalApplicationQueries,
  wasteType: wasteTypeQueries,
  user: userQueries,
  userRole: userRoleQueries,
}
