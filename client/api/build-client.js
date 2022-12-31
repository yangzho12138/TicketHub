import axios from 'axios'

const BuildClient = ({ req }) => {
    if(typeof window === 'undefined'){
        // the request will be sent from the server --> domain problem
        // ingress-nginx and client are in the different namesapce
        // kubectl get namespace --> client is in the defalut namaspace(kubectl get services) and ingress-nginx is in the ingress-nginx namespace
        // use kubectl get services -n [namespace name] could see the service in a specific namespace
        // ingress-nginx-controller is the service real name of ingress-nginx
        // the domain should be 'http://SERVICENAME.NAMESPACE.svc.cluster.local'
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            // specify the host name for ingress-srv configuration to identify Host: ticketing.dev
            // set the cookie
            headers: req.headers
        })
    }else{
        // the request will be sent from the browser --> no domain problem
        // browser will handle appending on some headers automatically
        return axios.create({
            baseURL: '/'
        })
    }
}

export default BuildClient