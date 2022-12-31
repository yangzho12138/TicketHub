import 'bootstrap/dist/css/bootstrap.css' // global css
import buildClient from '../api/build-client'

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <Component {...pageProps} />
}

// appContext is different the context in an individual page: appContext.ctx = context
AppComponent.getInitProps = async(appContext) => {
    const client = buildClient(appContext.ctx)
    const { data } = await client.get('/api/users/currentuser')

    // getInitProps of an individual page will not be invoked automatically is there is a getInitProps on _app.js
    // manually call the individual page getInitProps 
    // some pages may not have getInitProps --> check
    let pageProps = {}
    if(appContext.Component.getInitProps){
        pageProps = await appContext.Component.getInitProps(appContext.ctx)
    }

    return {
        pageProps,
        ...data
    }
}

export default AppComponent