import React, { useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from "@chakra-ui/react";
import PostsList from "./PostsList";
import PagesList from "./PagesList";
import CategoriesList from "./CategoriesList";

function ContentManager() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box maxW="1200px" mx="auto" py={6}>
      <Heading size="lg" mb={6}>
        Content Management
      </Heading>
      <Tabs index={tabIndex} onChange={setTabIndex} variant="line">
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Pages</Tab>
          <Tab>Categories</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PostsList />
          </TabPanel>
          <TabPanel>
            <PagesList />
          </TabPanel>
          <TabPanel>
            <CategoriesList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default ContentManager;
