import { createRouter, createWebHistory } from 'vue-router'
import routes from "./routers";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  next();
});
export default router
