/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FocusArea = 'Builder' | 'Learner' | 'Contributor' | 'Creator';
export type ProofCategory = 'Build' | 'Learn' | 'Contribute' | 'Earn' | 'Event';

export interface Profile {
  name: string;
  username: string;
  bio: string;
  focus: FocusArea;
}

export interface Proof {
  id: string;
  title: string;
  description: string;
  link: string;
  category: ProofCategory;
  timestamp: number;
}

export type Screen = 'Profile' | 'Add Proof' | 'Timeline' | 'Public';
