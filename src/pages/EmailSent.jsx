import { useSelector } from 'react-redux';

const EmailSent = () => {
    const {registerMessage} = useSelector(state=>state.auth);


    return (<>
    email sent to {registerMessage}
    </>  );
}
 
export default EmailSent;