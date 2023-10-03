import { Fragment, useState, useEffect } from 'react';
import './style.scss';
import { useSelector, useDispatch } from 'react-redux';
import {Spinner, useToast } from '@chakra-ui/react';
import { usePutUserBioDataMutation } from '../../features/resources/resources-api-slice';
function BioDataWidget() {
    const toast = useToast()
    const userInfo = useSelector((state) => state.authentication.user);
    const [putBioData, { isLoading: isPuttingBiodata, error: errorPuttingBiodata }] = usePutUserBioDataMutation()

    const [user, setUser] = useState({
        id:userInfo?.id,
        username:userInfo?.username,
        surname: userInfo?.surname,
        other_names: userInfo?.other_names,
        phone:userInfo?.phone,
        gender:userInfo?.gender
        
    })

    // Handle change
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
    
        if (name === "gender") {
            // Handle gender differently
            setUser({ ...user, gender: value });
        } else {
            // Handle other fields
            setUser({ ...user, [name]: value });
        }
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const body = { 
            id:user.id,
            surname:user.surname,
            other_names:user.other_names,
            phone:user.phone, 
            gender:user.gender }
        const response = await putBioData(body).unwrap()
        const message = response["message"]
        const errormessage = response["error_message"]
        if (message !== undefined || message !== null) {
            toast({
                position: 'top-center',
                title: `Success`,
                description: message,
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }else{
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: errormessage,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
       
    }

    return (
        <Fragment>
            <form className="row bio-data p-3" onSubmit={handleFormSubmit}>
                <div className="mb-3 col-md-6">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" aria-describedby="username"
                        name="username"
                        value={user.username}
                        disabled
                        required
                        />
                </div>
                <div className="mb-3 col-md-6">
                    <label htmlFor="surname" className="form-label">Surname</label>
                    <input type="text" className="form-control" id="surname" aria-describedby="surname"
                        placeholder="Enter surname "
                        name="surname"
                        onChange={handleChange}
                        value={user.surname}
                        required
                        />
                </div>
                <div className="mb-3 col-md-6">
                    <label htmlFor="other_names" className="form-label">Other Name</label>
                    <input type="text" className="form-control" id="other_names" aria-describedby="other_names"
                        placeholder="Enter other names "
                        name="other_names"
                        onChange={handleChange}
                        value={user.other_names}
                        required
                        />
                </div>
                <div className="mb-3 col-md-6">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input type="number" className="form-control" id="phone" aria-describedby="phone"
                        placeholder="Enter phone Number"
                        name="phone"
                        onChange={handleChange}
                        value={user.phone}
                        required
                        />
                </div>

                <div className="mb-3 col-md-6">
                    <label htmlFor="gender" className="form-label text-black">Select Your Gender</label>
                    <select className="form-select" id="gender" aria-describedby="gender" 
                    name="gender" 
                    onChange={handleChange}
                    value={user.gender}
                    required>
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="mb-3 col-md-12">
                   <button className='btn btn-sm btn-primary d-flex align-items-center'
                    disabled={isPuttingBiodata}>
                    {isPuttingBiodata && <Spinner />}
                   Save</button>
                </div>
                

            </form>
        </Fragment>);
}

export default BioDataWidget;