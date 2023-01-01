import buildClient from "../api/build-client"

const LandingPage = ({ currentUser }) => {
    return(
        <h1>Landing</h1>
    )
} 

// fetch data in the server side rendering process -> can not do in the component Landning Page
// retunr value is the props of the component
// make request from component is request from browser, geiInitProps is request from server
// Special Case: when navigate from one page to another (componentA to componentB, componnetB's getInitialProps will be executed on client) while in the app --> getInitialProps executed on the client!!! --> not care about the domain problem
// hard refresh/click link from different domain/ type URL into address bar --> getInitialProps executed on the server --> care about the domain problem
LandingPage.getInitialProps = async(context) => {
    // use a reusable API client
    const client = buildClient(context) // instance of axios
    const { data } = await client.get('/api/users/currentuser')
    return data
}

export default LandingPage