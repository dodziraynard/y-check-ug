import React, {useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { 
  get_permissions_list,
  get_users_for_permissions_list,
  add_permission
} from '../../../actions/PermissionAction';

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
    const selectedPermission = event.target.value;

    if (selectedPermissions.includes(selectedPermission)) {
      // Permission is already selected, so remove it
      setSelectedPermissions(selectedPermissions.filter((perm) => perm !== selectedPermission));
    } else {
      // Permission is not selected, so add it
      setSelectedPermissions([...selectedPermissions, selectedPermission]);
    }
  };

  // HANDLE FORM SUBMISSION
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(add_permission(user.user_id,selectedPermissions))
    setSelectedPermissions([])
    setUser({
        user_id:""
    })
  };
  
  useEffect(() => {
    if (permisson) {
        setShowSuccessMessage(true);
        
        const timer = setTimeout(() => {
            setShowSuccessMessage(false); // Hide the success message after 20 seconds
        }, 1000); 
        window.location.reload()
        return () => clearTimeout(timer);
    }
  }, [permisson, navigate]);
  

  return (
    <div>
        <div className='basic_form home-question-form'>
            {error? <span className='login-error'>{error}</span>:''}
            {showSuccessMessage ? <span className='login-success'> Permissions assigned successfully</span> : ''}
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
                <div style={{marginTop:"20px", cursor:"pointer"}} >
                    <label >Select Permissions:</label>
                    {permissions_results.map((permission, index) => (
                    <div key={index}>
                        <input
                        type='checkbox'
                        id={permission.codename}
                        name={permission.codename}
                        value={permission.codename}
                        onChange={handlePermissionsSelect}
                        />
                        <label htmlFor={permission.codename}>{permission.name}</label>
                    </div>
                    ))}
                </div>
            
                <button>Assign Permission(s)</button>

            </form>
        </div>
    </div>
  )
}

export default PermissionForm
