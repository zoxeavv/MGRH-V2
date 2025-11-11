import React from "react";

type PageContainerProps = {
  description?: string;
  children: React.ReactNode;
  title?: string;
};

const PageContainer = ({
  title,
  description,
  children,
}: PageContainerProps) => (
  <div>
    {title ? <title>{title}</title> : null}
    {description ? (
      <meta name="description" content={description} />
    ) : null}
    {children}
  </div>
);

export default PageContainer;
