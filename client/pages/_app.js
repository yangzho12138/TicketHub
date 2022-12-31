import 'bootstrap/dist/css/bootstrap.css' // global css
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    )
}

// appContext is different the context in an individual page: appContext.ctx = context
AppComponent.getInitialProps = async(appContext) => {
    const client = buildClient(appContext.ctx)
    const { data } = await client.get('/api/users/currentuser')

    // getInitialProps of an individual page will not be invoked automatically is there is a getInitialProps on _app.js
    // manually call the individual page getInitialProps 
    // some pages may not have getInitialProps --> check
    let pageProps = {}
    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }

    return {
        pageProps,
        ...data
    }
}

export default AppComponent