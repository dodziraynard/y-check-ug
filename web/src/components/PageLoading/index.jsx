import { Spinner } from '@chakra-ui/react'
import './style.scss';

const PageLoading = () => {

    return (
        <div className="page-loading">
            <div>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='#203c6c'
                    size='xl'
                />
                <p>Loading...</p>
            </div>
        </div >
    );
}

export default PageLoading;
