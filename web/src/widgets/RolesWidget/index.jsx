import './style.scss';
import {
    useLazyGetGroupsQuery,
    usePutGroupsMutation,
    useDeleteGroupsMutation,
} from '../../features/resources/resources-api-slice';
import {
    setGroups as setStoreGroups,
} from '../../features/global/global-slice';
import { Fragment, useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import PermissionComponent from '../../components/Permission/PermissionComponent';

function RolesWidget() {
    const [getGroups, { data: response = [], isFetching, error }] = useLazyGetGroupsQuery()
    const modalRef = useRef(null);
    const deletionModalRef = useRef(null);
    const permissionModalRef = useRef(null);
    const [modal, setModal] = useState(null);
    const [deleteAlertModal, setDeletionAlertModal] = useState(null);
    const [permissionsModal, setPermissionsModal] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const toast = useToast()
    const [groups, setGroups] = useState([])
    const dispatch = useDispatch()

    const [putGroup, { isLoading: isPuttingGroup, error: errorPuttingGroup }] = usePutGroupsMutation()
    const [deleteGroup, { isLoading: isDeletingGroup, error: errorDeletingGroup }] = useDeleteGroupsMutation()

    // Form input
    const [name, setName] = useState('');

    useEffect(() => {
        setGroups(response["groups"])
        dispatch(setStoreGroups(response["groups"]))
    }, [isFetching])


    useEffect(() => {
        getGroups()
    }, [])

    console.log(groups)
    useEffect(() => {
        if (modalRef.current !== null && modal === null) {
            const modal = new Modal(modalRef.current, { keyboard: false })
            setModal(modal)
        }

        if (deletionModalRef.current !== null && deleteAlertModal === null) {
            const modal = new Modal(deletionModalRef.current, { keyboard: false })
            setDeletionAlertModal(modal)
        }

        if (permissionModalRef.current !== null && permissionsModal === null) {
            const modal = new Modal(permissionModalRef.current, { keyboard: false })
            setPermissionsModal(modal)
        }
    }, [])

    const showEditGroupModal = (group) => {
        setSelectedGroup(group)
        setName(group.name)
        modal?.show()
    }

    const showNewFormGroupModal = () => {
        setSelectedGroup(null)
        setName('')
        modal?.show()
    }

    const handleDeleteGroup = async () => {
        const response = await deleteGroup({ id: selectedGroup.id }).unwrap()
        const errorMessage = response["error_message"]
        if (errorMessage !== undefined || errorMessage !== null) {
            setGroups(groups.filter(c => c.id !== selectedGroup.id))
            toast({
                position: 'top-center',
                title: `Success`,
                description: "Group deleted successfully",
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
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

    const showDeleteGroupAlert = (group) => {
        setSelectedGroup(group)
        deleteAlertModal?.show()
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const body = { name }
        if (selectedGroup) {
            body['id'] = selectedGroup.id
        }
        const response = await putGroup(body).unwrap()
        const group = response["group"]
        if (group !== undefined) {
            setGroups([group, ...groups.filter(c => c.id !== group.id)])
        }

        modal?.hide()
        setName('')
    }

    useEffect(() => {
        if (errorPuttingGroup) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorPuttingGroup.originalStatus}`,
                description: errorPuttingGroup.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorPuttingGroup])

    useEffect(() => {
        if (errorDeletingGroup) {
            toast({
                position: 'top-center',
                title: `An error occurred: ${errorDeletingGroup.status}`,
                description: errorDeletingGroup.status,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [errorDeletingGroup])

    const showPermissionsModal = (group) => {
        setSelectedGroup(group)
        permissionsModal?.show()
    }



    return (
        <div className="dashboard-widget">
           <div ref={permissionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedGroup?.name}'s Permissions
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <PermissionComponent group={selectedGroup} />
                        </div>
                    </div>
                </div>
            </div>

            <div ref={deletionModalRef} className="modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Delete Group - '{selectedGroup?.name}'
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body d-flex justify-content-center overflow-scroll">
                                <div className="d-flex flex-column">
                                    <h5>Are you sure you want to delete this group?</h5>
                                    <p className="text-muted">This action cannot be undone.</p>
                                </div>
                            </div>
                            <p className="text-center mb-3">
                                {isDeletingGroup && <Spinner />}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteGroup(selectedGroup)} >Yes, continue</button>
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
                                {selectedGroup ? "Edit Role" : "New Role"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body overflow-scroll">
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="id"
                                    value={selectedGroup ? selectedGroup.id : ""} />

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" aria-describedby="name"
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter role name"
                                        value={name} />
                                </div>
                                <div className="mb-3">
                                    <p className="text-end">
                                        <button
                                            className='btn btn-sm btn-primary d-flex align-items-center'
                                            disabled={isPuttingGroup}>
                                            {isPuttingGroup && <Spinner />}
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

            <div className="card">
                <div className="card-header d-flex justify-content-between" style={{ "position": "sticky", "top": "-1em", "zIndex": "1", "background": "white" }}>
                    <p>ROLES</p>
                    <div className="d-flex  justify-content-end">
                        <Button onClick={showNewFormGroupModal}><i className="bi bi-plus"></i> Add</Button>

                    </div>
                </div>
                <div className="card-body overflow-scroll">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching && <tr><td colSpan="2">Loading...</td></tr>}
                            {(!isFetching && groups?.length == 0) && <tr><td colSpan="2">No roles</td></tr>}
                            {error && <tr><td colSpan="2">Error: {error.status}</td></tr>}
                            {groups && groups?.map((group, index) => (
                                <tr key={index}>
                                    <td>{group.name}</td>
                                    <td className='d-flex'>
                                        <button className="mx-1 btn btn-primary btn-sm d-flex"
                                            onClick={() => showPermissionsModal(group)}>
                                            <i className="bi bi-shield-lock me-1"></i> Permissions
                                        </button>
                                        <button className="mx-1 btn btn-outline-primary btn-sm d-flex"
                                            onClick={() => showEditGroupModal(group)}>
                                            <i className="bi bi-pen me-1"></i> Edit
                                        </button>
                                        <button className="mx-1 btn btn-outline-primary btn-sm d-flex"
                                            onClick={() => showDeleteGroupAlert(group)}
                                        ><i className="bi bi-trash me-1"></i> Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default RolesWidget;
