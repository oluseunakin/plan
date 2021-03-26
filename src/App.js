import React, { useState } from 'react';
import {
  ChakraProvider,
  Text,
  theme,
  Center,
  Checkbox,
  Stack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormLabel,
  Button,
  OrderedList,
  ListItem,
  HStack,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';

function App() {
  const [startPlan, addStartPlan] = useState({});
  const [endPlans, addEndPlans] = useState([]);
  const [name, setName] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(23);
  const [username, setUsername] = useState('');
  const [plans, setPlans] = useState([]);
  const [achieved, setAchieved] = useState([]);
  const [planned, setPlanned] = useState(false);

  const home = (
    <Stack>
      <Heading>Your Daily Planner</Heading>
      <Text fontSize="2xl">Strive for success in all you do</Text>
    </Stack>
  );

  let toRender = (
    <Stack spacing="3" mt="4">
      {home}
      <Input defaultValue={username} onBlur={e => setUsername(e.target.value)} />
      <Button>Enter</Button>
    </Stack>
  );

  function makeRecommendation(plans, achieved) {
    const calc = Math.round(achieved.length / plans.length) * 100;
    let result;
    switch (calc) {
      case 100:
        result = "You set the goals and you went for them, You're a champion";
        break;
      case 80:
      case 90:
        result = "You're destined for success, put extra effort";
        break;
      case 50:
      case 60:
      case 70:
        result = 'Getting there, put more effort';
        break;
      case 10:
      case 20:
      case 30:
      case 40:
        result = 'You have to set your eyes on those goals';
        break;
      default:
        result = '';
    }
    return result;
  }
  if (username) {
    toRender = planned ? (
      home
    ) : (
      <Stack spacing="4">
        <Heading>Create plans for the day</Heading>
        <Input value={name} onChange={e => setName(e.target.value)} />
        <FormLabel htmlFor="start">Start hour </FormLabel>
        <NumberInput
          defaultValue={9}
          min={0}
          max={23}
          id="start"
          onChange={val => setStart(val)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormLabel htmlFor="end">End hour</FormLabel>
        <NumberInput
          defaultValue={15}
          min={0}
          max={23}
          id="end"
          onChange={value => setEnd(value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button
          size="sm"
          colorScheme="gray"
          onClick={() => setPlans([...plans, { name, start, end }])}
        >
          Add plan
        </Button>
        <OrderedList>
          {plans.map((plan, index) => (
            <ListItem key={index}>
              <Text>{plan.name}</Text>
              <HStack>
                <Text>Start {plan.start}</Text>
                <Text>End {plan.end}</Text>
              </HStack>
            </ListItem>
          ))}
        </OrderedList>
        <Button
          colorScheme="teal"
          onClick={() => {
            plans.forEach(plan => {
              const startDuration =
                (plan.start - new Date().getHours()) * 60 * 60 * 1000;
              const endDuration =
                (plan.end - new Date().getHours()) * 60 * 60 * 1000;
              setTimeout(() => addStartPlan(plan), startDuration);
              setTimeout(() => addEndPlans([...endPlans, plan]), endDuration);
            });
            setPlanned(true);
          }}
        >
          Start your day
        </Button>
      </Stack>
    );
  }
  if (Object.keys(startPlan).length > 0)
    toRender = <Text>Start {startPlan.name} now</Text>;
  if (endPlans.length > 0) 
    toRender = (
      <Checkbox
        onChange={e => {
          if (e.target.checked) {
            setAchieved([...achieved, endPlans[endPlans.length - 1]]);
            toRender = <Text>Plan your life</Text>;
            if (endPlans.length === plans.length) {
              const recommendation = makeRecommendation(endPlans, achieved);
              axios
                .post('http://localhost:3000/user', { username })
                .then(response => {
                  axios.put('http://localhost:3000/user?id=' + response._id, {
                    recommendation,
                  });
                });
            }
          }
        }}
      >
        Check if you went through with {endPlans[endPlans.length - 1].name}
      </Checkbox>
    );

  return (
    <ChakraProvider theme={theme}>
      <Center>{toRender}</Center>
    </ChakraProvider>
  );
}

export default App;
