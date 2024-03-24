import './style.scss';
import {
    useLazyGetGroupsQuery,
    usePutUsersMutation,
    useDeleteUsersMutation,
    useLazyGetAllFacilitiesQuery,
} from '../../features/resources/resources-api-slice';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
    setGroups as setStoreGroups,
} from '../../features/global/global-slice';
import { Modal } from 'bootstrap';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import TagInput from '../../components/TagInput';
import PasswordInput from '../../components/PasswordInput';
import SelectInput from '../../components/SelectInput';
import PageLoading from '../../components/PageLoading';
import { BASE_API_URI } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import BreadCrumb from '../../components/BreadCrumb';

const TableView = React.lazy(() => import("../../components/Table"));

function UsersWidget() {
    const dispatch = useDispatch()
    const [triggerReload, setTriggerReload] = useState(0);
    const modalRef = useRef(null);
    const deletionModalRef = useRef(null);
    const [modal, setModal] = useState(null);
    const [deleteAlertModal, setDeletionAlertModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const toast = useToast()
    const [users, setUsers] = useState([])
    const [hidePassowordUpdate, setHidePassowordUpdate] = useState(true);
    const [urlParams, setUrlParams] = useState("");

    const [putUser, { isLoading: isPuttingUser, error: errorPuttingUser }] = usePutUsersMutation()
    const [deleteUser, { isLoading: isDeletingUser, error: errorDeletingUser }] = useDeleteUsersMutation()
    const [getGroups, { data: response = [], isFetching, error }] = useLazyGetGroupsQuery()
    const [getFacilities, { data: res = [], isFetching1, }] = useLazyGetAllFacilitiesQuery()
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [allUsers] = useState([])
    const [groups, setGroups] = useState([])
    const [facilities, setFacilities] = useState([])

    // Form input
    const [username, setUsername] = useState('');
    const [surname, setSurname] = useState('');
    const [otherNames, setOtherNames] = useState('');
    const [phone, setPhone] = useState('');
    const [facility, setFacility] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);


    // Filter inputs
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('surname');

    useEffect(() => {
        const groups = selectedUser?.groups || []
        setSelectedGroups(groups)
    }, [selectedUser])


    useEffect(() => {
        setGroups(response["groups"])
        dispatch(setStoreGroups(response["groups"]))
    }, [isFetching])

    useEffect(() => {
        getGroups()
    }, [])

    useEffect(() => {
        getFacilities();
    }, [getFacilities]);

    useEffect(() => {
        if (res && Array.isArray(res.facilities)) {
            setFacilities(res.facilities);
        }
    }, [res]);

    useEffect(() => {
        if (modalRef.current !== null && modal === null) {
            const modal = new Modal(modalRef.current, { keyboard: false })
            setModal(modal)
        }

        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current, { keyboard: false })
            setDeletionAlertModal(modal)
        }
    }, [deleteAlertModal])

    const showEditUserModal = (user) => {
        setSelectedUser(user)
        setUsername(user.username)
        setSurname(user.surname || "")
        setOtherNames(user.other_names || "")
        setPhone(user.phone || "")
        setFacility(user.facility || "")
        setIsActive(user.is_active)
        setPassword("")
        modal?.show()
    }

    const showNewFormUserModal = () => {
        setSelectedUser(null)
        setUsername("")
        setSurname("")
        setOtherNames("")
        setPhone("")
        setFacility("")
        setPassword("")
        modal?.show()
    }

    const handleDeleteUser = async () => {
        const response = await deleteUser({ id: selectedUser.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            setUsers(users.filter(c => c.id !== selectedUser.id))
            toast({
                position: 'top-center',
                title: `Success`,
                description: "User deleted successfully",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
            setTriggerReload((triggerReload) => triggerReload + 1);
        } else {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: errorMessage,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
        deleteAlertModal?.hide()
    }

    const showDeleteUserAlert = (user) => {
        setSelectedUser(user)
        deleteAlertModal?.show()
    }

    const handleFormSubmit = async (e) => {
        if (!(username && surname && otherNames, phone, facility)) {
            alert("Choose complete all fields.")
        }

        e.preventDefault()
        const body = {
            username,
            surname,
            other_names: otherNames,
            phone,
            facility,
            groups: selectedGroups,
            is_active: isActive,
            password: password,
        }
        if (selectedUser) {
            body['id'] = selectedUser.id
        }
        const response = await putUser(body).unwrap()
        const user = response["user"]
        if (user !== undefined) {
            setUsers([user, ...users.filter(c => c.id !== user.id)])
            modal?.hide()
            setTriggerReload((triggerReload) => triggerReload + 1);
        } else {
            toast({
                position: 'top-center',
                title: `An error occurred`,
                description: response["error_message"],
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    useEffect(() => {
        if (errorPuttingUser) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorPuttingUser.originalStatus}`,
                description: errorPuttingUser.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingUser, toast])


    useEffect(() => {
        if (errorDeletingUser) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorDeletingUser.status}`,
                description: errorDeletingUser.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorDeletingUser, toast])

    useEffect(() => {
        const users = allUsers.filter(c => {
            return c.surname?.toLowerCase()?.includes(search.toLowerCase())
                || c.other_names?.toLowerCase()?.includes(search?.toLowerCase())
                || c.phone?.toLowerCase()?.includes(search?.toLowerCase())
                || c.username?.toLowerCase()?.includes(search?.toLowerCase())
        })
        setUsers(users)
    }, [search])

    useEffect(() => {
        const toToSorted = [...users]
        toToSorted.sort((a, b) => {
            if (a[sort] < b[sort]) {
                return -1;
            }
            return 1;
        })
        setUsers(toToSorted)
    }, [sort])

    return (
        <div>
            <BreadCrumb items={[{ "name": "Users" }]} />
            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete User - '{selectedUser?.other_names} {selectedUser?.surname}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this user?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingUser && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteUser(selectedUser)} >Yes, continue</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={modalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedUser ? "Edit User" : "New User"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="id"
                                    value={selectedUser ? selectedUser.id : ""} />

                                <p><b>BIO</b></p>
                                <div className="mb-3">
                                    <label htmlFor="surname" className="form-label">UserName/Staff ID</label>
                                    <input type="text" className="form-control" id="username" aria-describedby="username"
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username or staff id"
                                        required
                                        value={username} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="surname" className="form-label">Surname</label>
                                    <input type="text" className="form-control" id="surname" aria-describedby="surname"
                                        onChange={(e) => setSurname(e.target.value)}
                                        placeholder="Enter surname"
                                        required
                                        value={surname} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="other-names" className="form-label">Other Names</label>
                                    <input type="text" className="form-control" id="other-names" aria-describedby="other-names"
                                        onChange={(e) => setOtherNames(e.target.value)}
                                        placeholder="Enter other names"
                                        required
                                        value={otherNames} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input type="text" className="form-control" id="phone" aria-describedby="phone"
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter phone number"
                                        required
                                        value={phone} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="facility" className="form-label">Facility</label>
                                    <SelectInput
                                        onChange={(e) => setFacility(e.target.value)}
                                        required={true}
                                        value={facility}
                                        options={[
                                            { value: "", label: 'Choose Facility' },
                                            ...(facilities ? facilities.map(item => ({
                                                value: item.id,
                                                label: `${item.name}, ${item.location}`
                                            })) : [])
                                        ]}
                                    />
                                </div>

                                <div className="mt-5">
                                    <p><b>GROUPS</b></p>
                                    <TagInput tags={groups?.map((group) => group.name)} selectedTags={selectedGroups} setSelectedTags={setSelectedGroups} maxSelection={groups?.length} searchable={true} />
                                </div>

                                <div className="my-3">
                                    <p className="p-0 m-0">
                                        <small className="text-muted">Uncheck to block this user.</small>
                                    </p>
                                    <label htmlFor="is_active" className="form-label">Is Active</label>
                                    <input type="checkbox" className="ms-2 form-check-input" id="is_active" aria-describedby="is_active"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)} />
                                </div>

                                <div className="my-5">
                                    <div className="d-flex justify-content-between">
                                        <p><b>PASSWORD</b></p>
                                        <button className="btn btn-light"
                                            type='button'
                                            onClick={() => {
                                                setPassword("")
                                                setHidePassowordUpdate(!hidePassowordUpdate)
                                            }}>
                                            {hidePassowordUpdate && "show"}
                                            {!hidePassowordUpdate && "hide"}
                                        </button>
                                    </div>
                                    {!hidePassowordUpdate &&
                                        <div>
                                            {selectedUser && <p className="text-muted">Leave blank to keep current password</p>}
                                            <PasswordInput value={password} setValue={setPassword} required={selectedUser === null} />
                                        </div>
                                    }
                                </div>

                                <div className="mb-5">
                                    {Boolean(selectedUser?.created_by) ? <p className='m-0 p-0'><small className=""><i>Created By: {selectedUser?.created_by}</i></small></p> : ""}
                                    {Boolean(selectedUser?.updated_by) ? <p className='m-0 p-0'><small className=""><i>Updated By: {selectedUser?.updated_by}</i></small></p> : ""}
                                </div>

                                <div className="mb-3">
                                    <p className="text-end">
                                        <button
                                            className='btn btn-sm btn-primary d-flex align-items-center'
                                            disabled={isPuttingUser}>
                                            {isPuttingUser && <Spinner />}
                                            Submit
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-users">
                <div className="d-flex justify-content-between" style={{ "position": "sticky", "top": "0em", "zIndex": "1", "background": "white" }}>
                    <p>USERS</p>
                    <div className="d-flex justify-content-end">
                        <Button onClick={showNewFormUserModal}><i className="bi bi-plus"></i> Add</Button>

                    </div>
                </div>
                <div className="overflow-scroll">
                    <Suspense fallback={<PageLoading />}>
                        <TableView
                            reloadTrigger={triggerReload}
                            responseDataAttribute="users"
                            dataSourceUrl={`${BASE_API_URI}/users/`}
                            urlParams={urlParams}
                            setUrlParams={setUrlParams}
                            filters={[
                                ...(groups?.map(group => { return { key: `groups__name:${group.name}`, value: `In ${(group.name || "").toLowerCase()}` } }) || []).sort()
                            ]}
                            bulkActions={[

                            ]}
                            headers={[{
                                key: "photo",
                                value: "Photo",
                                render: (item) => (
                                    <img
                                        src={item.photo ? item.photo : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                        alt="User Photo"
                                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                    />
                                ),
                            }, {
                                key: "username", value: "Username"
                            }, {
                            }, {
                                key: "surname", value: "Surname"
                            }, {
                                key: "other_names", value: "Other Names"
                            },
                            {
                                key: "groups", value: "Group", render: (item) => {
                                    return (
                                        <div>
                                            {item.groups?.map((group, index) => (
                                                <span key={index} className="badge bg-primary">{group}</span>
                                            ))}
                                        </div>
                                    )
                                }
                            }, {
                                value: "Actions", textAlign: "right", render: (item) => {
                                    return (
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-sm btn-primary me-1 d-flex" onClick={() => showEditUserModal(item)}>
                                                <i className="bi bi-list me-1"></i>
                                                More
                                            </button>
                                            <button className="btn btn-sm btn-outline-primary me-1 d-flex" onClick={() => showDeleteUserAlert(item)}>
                                                <i className="bi bi-trash me-1"></i>
                                                Delete
                                            </button>
                                        </div>
                                    )
                                }
                            }]}
                        />
                    </Suspense>
                </div>
            </div>
        </div >
    );
}

export default UsersWidget;
