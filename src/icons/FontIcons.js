import AntIcon from '@ant-design/icons';

const Icon = ({ className, type, ...props }) => {
  return (
    <AntIcon
      {...props}
      component={() => <span />}
      className={`${className || ''} anticon-${type}`}
    />
  );
};

/** Font Icon */
export const OpenMenuFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-menu-open" />
);

export const DashboardFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-dashboard" />
);

export const ReservationFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-reservation" />
);

export const CustomerFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-customer" />
);

export const HistoryFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-history" />
);

export const IncomeFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-income" />
);

export const ExtraServiceFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-extra-service" />
);

export const ReportFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-report" />
);

export const ConfigFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-config" />
);

export const SettingFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-setting" />
);

export const DailyExpenseFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-daily-expense" />
);

export const PhoneFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-phone" />
);

export const JobFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-job" />
);

export const BirthdayFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-birthday" />
);

export const FacebookFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-facebook" />
);

export const TwitterFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-twitter" />
);

export const LinkedinFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-linkedin" />
);

export const MoneyFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-money" />
);

export const CheckinFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-checkin" />
);

export const DailyCustomerFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-daily-customer" />
);

export const DailyIncomeFIcon = ({ ...props }) => (
  <Icon {...props} type="ic-daily-income" />
);

export const CompletedBookingIcon = ({ ...props }) => (
  <Icon {...props} type="ic-complete-booking" />
);

export const PaymentReminderIcon = ({ ...props }) => (
  <Icon {...props} type="ic-payment-reminder" />
);
