import { NavLink, type NavLinkProps } from "react-router";

interface BorderNavLinkProps extends NavLinkProps {
  borderColor?: {
    light?: string;
    dark?: string;
  };
  activeClassName?: string;
}

const getBorderColorClasses = (borderColor?: {
  light?: string;
  dark?: string;
}) => {
  const _borderColor = {
    light: "border-gray-300",
    dark: "border-gray-700",
    ...borderColor,
  };

  return `border-b ${_borderColor.light} dark:${_borderColor.dark}`;
};

export const BorderNavLink = ({
  to,
  children,
  borderColor,
  className = "",
  activeClassName = "",
  ...props
}: BorderNavLinkProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `pb-2 ${className} ${
          isActive
            ? `${getBorderColorClasses(borderColor)} ${activeClassName}`
            : ""
        }`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
};
