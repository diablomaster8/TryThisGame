import * as CAMPAIGN from '../src/content/campaign';
import { SIDE_STORY_CONTENT } from '../src/sim/side-story-content';
import { campaignContent, registerCampaign, registerSideStories } from '../src/sim/story-scenes';

// The app loads the campaign and side-story scripts as chunks before boot; tests register
// them up front, campaign first, as `loadStoryScripts` does.
registerCampaign(campaignContent(CAMPAIGN));
registerSideStories(SIDE_STORY_CONTENT);
