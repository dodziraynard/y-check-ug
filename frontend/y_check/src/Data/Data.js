import { mdiViewDashboardOutline,
    mdiAccountMultiplePlus,
    mdiCalendarAlertOutline,
    mdiAccountCog } from '@mdi/js';
    
export const SidebarData = [
    {
        icon: mdiViewDashboardOutline,
        heading:'Dashboard',
        url:'/dashboard'
    },
    {
        icon: mdiAccountMultiplePlus,
        heading:'Patients',
        url:'/patients'
    },
    {
        icon: mdiCalendarAlertOutline,
        heading:'Appointment'
    },
    {
        icon: mdiAccountCog,
        heading:'User Setting'
    },
   
    
]