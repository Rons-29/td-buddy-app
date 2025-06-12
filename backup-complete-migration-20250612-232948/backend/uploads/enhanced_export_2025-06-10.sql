-- TestData Buddy SQL Export
-- Generated at: 2025-06-10T14:56:17.850Z
-- Records: 10

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
  (1, 'テストデータ1', 882, FALSE, '2025-06-10T14:56:17.850Z', 0.2521543333274945, 'B', 'active', '2025-06-10T14:56:17.850Z'),
  (2, 'テストデータ2', 942, TRUE, '2025-06-10T14:56:17.850Z', 0.013292827011447406, 'A', 'active', '2025-06-10T14:56:17.850Z'),
  (3, 'テストデータ3', 421, TRUE, '2025-06-10T14:56:17.850Z', 0.8594421208533829, 'C', 'inactive', '2025-06-10T14:56:17.850Z'),
  (4, 'テストデータ4', 970, FALSE, '2025-06-10T14:56:17.850Z', 0.8723432063680798, 'C', 'active', '2025-06-10T14:56:17.850Z'),
  (5, 'テストデータ5', 925, FALSE, '2025-06-10T14:56:17.850Z', 0.4611605215552921, 'C', 'active', '2025-06-10T14:56:17.850Z'),
  (6, 'テストデータ6', 772, FALSE, '2025-06-10T14:56:17.850Z', 0.5717615104519194, 'C', 'inactive', '2025-06-10T14:56:17.850Z'),
  (7, 'テストデータ7', 809, TRUE, '2025-06-10T14:56:17.850Z', 0.08808497747470567, 'B', 'inactive', '2025-06-10T14:56:17.850Z'),
  (8, 'テストデータ8', 917, TRUE, '2025-06-10T14:56:17.850Z', 0.886198376604487, 'D', 'inactive', '2025-06-10T14:56:17.850Z'),
  (9, 'テストデータ9', 866, TRUE, '2025-06-10T14:56:17.850Z', 0.7059438759557894, 'C', 'inactive', '2025-06-10T14:56:17.850Z'),
  (10, 'テストデータ10', 596, FALSE, '2025-06-10T14:56:17.850Z', 0.799591361980921, 'C', 'active', '2025-06-10T14:56:17.850Z');

