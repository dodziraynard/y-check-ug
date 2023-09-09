import React, {useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { 
    get_permissions_list,
    get_users_for_permissions_list,
    add_permission
} from '../../actions/PermissionAction';

const PermissionForm = () => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [user,setUser] = useState({
    user_id:"",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate();
  // GET ALL USERS
  const user_for_permission_list = useSelector(state => state.user_for_permission_list);
  const {permissions_users } = user_for_permission_list;

  // GET ALL PERMISSIONS
  const permission_list = useSelector(state => state.permission_list);
  const { permissions_results } = permission_list;

  // GET ALL PERMISSIONS
  const assign_permission = useSelector(state => state.assign_permission);
  const { error, permisson } = assign_permission;
  console.log(permisson)

  useEffect(() => {
    dispatch(get_users_for_permissions_list());
    dispatch(get_permissions_list())
  }, [dispatch, user.user_id]);

// HANDLE INPUT CHANGE
  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setUser({ ...user, [name]: value });
  };

  // HANDLE PERMISSIONS SELECT
  const handlePermissionsSelect = (event) => {
    const selectedPermissionValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedPermissions(selectedPermissionValues);
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Selected Permissions:', selectedPermissions);
    console.log('Selected User:', user.user_id);
    dispatch(add_permission(user.user_id,selectedPermissions))
  };
  

  return (
    <div>
        <div className='basic_form home-question-form'>
            {error? <span className='login-error'>{error}</span>:''}
            {showSuccessMessage ? <span className='login-success'> Options Added Successfully</span> : ''}
            <h1>Add Permission Form </h1>
            <form className='form-input'onSubmit={handleSubmit} >
                <label style={{marginTop:"10px"}} htmlFor=""> Select User</label>
                <select 
                    name="user_id" 
                    onChange={handleChange}
                    value={user.user_id}
                    required>
                    <option value=''>Select a user</option>
                    {permissions_users.map((user, index) => (
                    <option key={index} value={user.id}>
                    {user.username}
                    </option>
                    ))}
                </select>
                <div style={{marginTop:"10px"}} >
                    <label >Select Permissions:</label>
                    <select multiple
                    onChange={handlePermissionsSelect} 
                    value={selectedPermissions} 
                    >
                    {permissions_results.map((permission, index) => (
                    <option key={index} value={permission.codename}>
                        {permission.name}
                    </option>
                    ))}
                    </select>
                </div>
            
                <button>Add Option</button>

            </form>
        </div>
    </div>
  )
}

export default PermissionForm
