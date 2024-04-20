import paths from '@root/routes';
import {
  BarChartBig,
  EarthIcon,
  LayoutDashboardIcon,
  TargetIcon,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    title: 'Dashboard',
    path: paths.dashboard,
    icon: <LayoutDashboardIcon className="w-5" />,
  },
  {
    title: 'Goals',
    path: paths.goals,
    icon: <TargetIcon className="w-5" />,
  },
  {
    title: 'Progress',
    path: paths.progress,
    icon: <BarChartBig className="w-5" />,
  },
  {
    title: 'Spaces',
    path: paths.spaces,
    icon: <EarthIcon className="w-5" />,
  },
];

export default NAV_ITEMS;
