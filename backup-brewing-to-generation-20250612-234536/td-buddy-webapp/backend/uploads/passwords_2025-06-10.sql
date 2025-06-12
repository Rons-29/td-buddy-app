-- QA Workbench SQL Export
-- Generated at: 2025-06-10T14:36:11.663Z
-- Records: 10

-- Table structure for test_data
CREATE TABLE IF NOT EXISTS `test_data` (
  `id` INTEGER,
  `password` VARCHAR(50),
  `length` INTEGER,
  `hasUpper` BOOLEAN,
  `hasLower` BOOLEAN,
  `hasNumber` BOOLEAN,
  `hasSymbol` BOOLEAN,
  `strength` VARCHAR(50),
  `generatedAt` VARCHAR(50)
);

-- Batch 1
INSERT INTO `test_data` (`id`, `password`, `length`, `hasUpper`, `hasLower`, `hasNumber`, `hasSymbol`, `strength`, `generatedAt`) VALUES
  (1, 'Ka9r^hU*Wjim', 12, TRUE, TRUE, TRUE, TRUE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (2, '05Qv9ElCMwL4', 12, TRUE, TRUE, TRUE, FALSE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (3, '&k60FBBbbNNd', 12, TRUE, TRUE, TRUE, TRUE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (4, 's@E&ftG14wLe', 12, TRUE, TRUE, TRUE, TRUE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (5, 'GRxUdC420Wjx', 12, TRUE, TRUE, TRUE, FALSE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (6, '@T3ZpQ!gLNsK', 12, TRUE, TRUE, TRUE, TRUE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (7, 'NflFaRZ8Vgwg', 12, TRUE, TRUE, TRUE, FALSE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (8, 'x0IJ0czr@!CC', 12, TRUE, TRUE, TRUE, TRUE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (9, 'ouKs%Favj1DS', 12, TRUE, TRUE, TRUE, TRUE, 'Strong', '2025-06-10T14:36:11.663Z'),
  (10, '6x%#qvu&rCy9', 12, TRUE, TRUE, TRUE, TRUE, 'Strong', '2025-06-10T14:36:11.663Z');

