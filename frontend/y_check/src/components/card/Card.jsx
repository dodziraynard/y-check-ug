import React, {useEffect} from 'react'
import './card.scss'
import Icon from '@mdi/react';
import { mdiAccountInjuryOutline,mdiDoctor,mdiAccountSupervisor,mdiCalendarAlertOutline } from '@mdi/js';
import { get_total_users } from '../../actions/userActions';
import { useSelector,useDispatch } from 'react-redux'
import { get_total_adolescent } from '../../actions/AddAdolescentAction';
function Card() {
    const dispatch = useDispatch()
    const get_all_users = useSelector(state => state.get_all_users);
    const { users } = get_all_users;

    const get_all_adolescent = useSelector(state => state.get_all_adolescent);
    const { adolescents } = get_all_adolescent;

    console.log(adolescents)

    useEffect(() => {
    dispatch(get_total_users());
    dispatch(get_total_adolescent());
    }, [dispatch]);

  return (
    <section>
        <div className='card'>
            <div className="logo">
            <Icon path={mdiAccountInjuryOutline} size={3} />
            </div>
            <div className="content">
                <h2>{adolescents?.total_adolescent}</h2>
                <h5>Total Adolescents</h5>
            </div>
        </div>
        <div className='card'>
            <div className="logo">
            <Icon path={mdiCalendarAlertOutline} size={3} />
            </div>
            <div className="content">
                <h2>90</h2>
                <h5>Appointment</h5>
            </div>
        </div>
        <div className='card move'>
            <div className="logo">
            <Icon path={mdiDoctor} size={3} />
            </div>
            <div className="content">
                <h2>{users?.total_users}</h2>
                <h5>Total Users</h5>
            </div>
        </div>
        <div className='card move'>
            <div className="logo">
            <Icon path={mdiAccountSupervisor} size={3} />
            </div>
            <div className="content">
                <h2>13</h2>
                <h5>Groups</h5>
            </div>
            
        </div>
    </section>
  )
}

export default Card
