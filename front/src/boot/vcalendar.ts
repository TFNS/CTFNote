import { boot } from 'quasar/wrappers';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

export default boot(({ app }) => {
  app.use(VCalendar, {});
});
