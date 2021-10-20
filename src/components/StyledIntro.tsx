import React, { FunctionComponent } from 'react';
import { Container, Typography } from '@mui/material';

type ChildrenProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
};

type StyledIntroProps = {
  children: ChildrenProps;
  priority?: 1 | 2 | 3 | 4 | 5;
  additionalClasses?: string;
};

function priorityToTag(priority: 1 | 2 | 3 | 4 | 5): 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  switch (priority) {
    case 1:
      return 'h2';
    case 2:
      return 'h3';
    case 3:
      return 'h4';
    case 4:
      return 'h5';
    case 5:
      return 'h6';
  }
}

export const StyledIntro: FunctionComponent<StyledIntroProps> = ({ children, priority = 1 }) => (
  <Container>
    <Typography variant={priorityToTag(priority)} align="center">
      {children.title}
    </Typography>
    {children.description && <Typography align="center">{children.description}</Typography>}
  </Container>
);
