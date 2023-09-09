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
        heading:'Adolescent',
        url:'/patients'
    },
    {
        icon: mdiCalendarAlertOutline,
        heading:'Appointment'
    },
    {
        icon: mdiAccountCog,
        heading:'User Setting',
        url:'/permission-page'
    },
    {
        icon: mdiAccountCog,
        heading:'Add School',
        url:'/add_school'
    },
    {
        icon: mdiAccountCog,
        heading:'Add Question',
        url:'/add_question'
    },
   
    
]