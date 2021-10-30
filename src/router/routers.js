const routes = [
  {
    path: "/",
    component: () => import("@/layout/client/Layout.vue"),
    children: [
        { path: "/", component: () => import("@/views/client/Home.vue") },
    ],
  },
  {
    path: "/digital/admin",
    component: () => import("@/layout/admin/Layout.vue")
  },
];
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
      path: '/:catchAll(.*)',
      component: () =>
          import ('@/views/error/Error404.vue')
  })
}
export default routes;
