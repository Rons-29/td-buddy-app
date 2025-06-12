-- TestData Buddy SQL Export
-- Generated at: 2025-06-10T14:51:53.869Z
-- Records: 2

-- Table structure for test_data
CREATE TABLE IF NOT EXISTS `test_data` (
  `id` INTEGER,
  `testField1` VARCHAR(50),
  `testField2` INTEGER,
  `testField3` BOOLEAN,
  `testField4` VARCHAR(50),
  `randomValue` DECIMAL(10,2),
  `category` VARCHAR(50),
  `status` VARCHAR(50),
  `generatedAt` VARCHAR(50)
);

-- Batch 1
INSERT INTO `test_data` (`id`, `testField1`, `testField2`, `testField3`, `testField4`, `randomValue`, `category`, `status`, `generatedAt`) VALUES
  (1, 'テストデータ1', 316, FALSE, '2025-06-10T14:51:53.869Z', 0.9989941096791406, 'A', 'active', '2025-06-10T14:51:53.869Z'),
  (2, 'テストデータ2', 763, TRUE, '2025-06-10T14:51:53.869Z', 0.31375435425056053, 'A', 'pending', '2025-06-10T14:51:53.869Z');


