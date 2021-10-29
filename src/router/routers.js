const routes = [
  {
    path: "/",
    component: () => import("@/layout/LayoutClient.vue"),
    children: [
        { path: "/", component: () => import("@/views/client/Home.vue") },
    ],
  },
];
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
      path: '/:catchAll(.*)',
      component: () =>
          import ('../views/error/Error404.vue')
  })
}
export default routes;
