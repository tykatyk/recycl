import messageQueries from './message'
import adsQueries from './adsQueries'
import wasteTypeQueries from './wasteType'
import userQueries from './user'
import userRoleQueries from './userRole'

const queries = {
  message: messageQueries,
  ad: adsQueries,
  wasteType: wasteTypeQueries,
  user: userQueries,
  userRole: userRoleQueries,
}
export default queries
