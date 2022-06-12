import VueRouter from "vue-router";
import index from '../components/index'
import logined from '../components/logined'
import logining from '../components/logining'
import registered from '../components/registered'
import myadmin from "../components/myadmin"
import recourse from "../components/recourse"
import recoursepage from "../components/recoursepage"
import userpage from "../components/userpage"
import store from "../store"
const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: '/',
            redirect: index
        },
        {
            path: '/index',
            name: 'IndexMain',
            component: index
        },
        {
            path: '/logined',
            name: 'LoginDone',
            component: logined,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/logining',
            name: 'LoginDoing',
            component: logining
        },
        {
            path: '/registered',
            name: 'RegisteredDoing',
            component: registered
        },
        {
            path: '/myadmin',
            name: 'MyAdmin',
            component: myadmin,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/recourse',
            name: 'RecourseIndex',
            component: recourse,
            meta: {
                requireAuth: true
            }

        },
        {
            path: '/recoursepage',
            name: 'RecoursePage',
            component: recoursepage,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/userpage',
            name: 'UserPage',
            component: userpage,
            meta: {
                requireAuth: true
            }
        }
    ]
})
router.beforeEach((to, from, next) => {
    // to and from are both route objects. must call `next`.
    const token = store.state.token
    if (to.meta.requireAuth) {
        if (token) {
            next()
        }
        else {
            console.log("需要登陆");
            next({
                path: "/logining"
            })
        }
    }
    else {
        next()
    }
})
export default router
