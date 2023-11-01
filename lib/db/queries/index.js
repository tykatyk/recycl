import messageQueries from './message'
import removalApplicationQueries from './removalApplication'
import wasteTypeQueries from './wasteType'
import userQueries from './user'
import userRoleQueries from './userRole'
import eventQueries from './eventQuery'

const queries = {
  message: messageQueries,
  removalApplication: removalApplicationQueries,
  wasteType: wasteTypeQueries,
  user: userQueries,
  userRole: userRoleQueries,
  eventQueries,
}
export default queries
