import messageQueries from './message'
import removalApplicationQueries from './removalApplication'
import wasteTypeQueries from './wasteType'
import userQueries from './user'
import userRoleQueries from './userRole'

const queries = {
  message: messageQueries,
  removalApplication: removalApplicationQueries,
  wasteType: wasteTypeQueries,
  user: userQueries,
  userRole: userRoleQueries,
}
export default queries
