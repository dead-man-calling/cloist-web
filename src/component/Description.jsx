import React, { useContext } from 'react';
import { Box, Text, Button, Nav, ResponsiveContext, Heading } from 'grommet';
import { UserNew, Login } from 'grommet-icons';

const Description = (props) => {
  const { push } = useContext(props.RouterContext);
  const size = useContext(ResponsiveContext);

  return (
    <Box fill="vertical" overflow="auto" align="center" flex="grow" direction="column" justify="start" animation="fadeIn" background={{ "color": "light-2" }}>
      <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal">
        <Box align="center" justify="center" direction="row" pad="small">
          <Text textAlign="center" color="dark-1" size={size === 'small' ? 'medium' : 'large'} style={{ fontFamily: 'Pacifico' }}>
            Cloist.
          </Text>
        </Box>
        <Nav align="center" flex={false} direction="row" pad="small" justify="center" gap={size === 'small' ? '20px' : '22px'}>
          <Button icon={<Login color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/signin')} />
          <Button icon={<UserNew color="dark-1" size={size === 'small' ? '20px' : '22px'} />} type="button" plain onClick={() => push('/signup')} />
        </Nav>
      </Box>
      <Box align="center" pad="medium" overflow="auto" width="100%">
        <Box pad="small">
          <Heading level="4"> 사용법</Heading>
          <Text size="small" style={{ whiteSpace: 'pre-wrap', lineHeight: size === 'small' ? '2em' : '2.5em' }}>
            {'1. 서비스 가입 후 모임을 생성한다.\n' +
             '2. 친한 친구들이나 팀원들을 모임에 초대한다.\n' +
             '3. 평소에 하지 못하던 말을 전하거나 글로 남긴다.\n' +
             '4. 좋은 사람이나 나쁜 사람에 대한 투표회를 연다.\n' +
             '    a. 투표에서 가장 표를 많이 얻은 사람은\n' +
             '        50점을 얻거나 잃는다.\n' +
             '5. 전달받은 말이 기분 나쁘다면 재판을 연다.\n' +
             '    a. 과반수가 나쁜 말이라 판단하면 나쁜\n' +
             '        말을 한 사람을 모두에게 공개한다.\n' +
             '    b. 나쁜 말을 한 사람은 100점을 잃는다.'}
          </Text>
          <Heading level="4">정책</Heading>
          <Text size="small" style={{ whiteSpace: 'pre-wrap', lineHeight: size === 'small' ? '2em' : '2.5em' }}>
            {'1. 모든 말이나 글은 익명성을 띤다.\n' +
             '2. 모두가 투표하면 투표회나 재판을 종료한다.\n' +
             '3. 자정까지 투표가 마무리되지 않으면 유효표를\n' +
             '    이용하여 투표회나 재판이 자동 종료된다.\n' +
             '4. 누적 점수에 따라 개인 타이틀이 변경된다.\n' +
             '5. 말이나 글을 남긴 사람은 삭제할 수 없다.'}
          </Text>
        </Box>
      </Box>
      <Box align="center" justify="between" flex={false} direction="row" pad="medium" fill="horizontal" />
    </Box>
  )
}

export default Description;