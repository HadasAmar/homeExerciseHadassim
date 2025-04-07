CREATE DATABASE family;

USE family;

CREATE TABLE People (
    ID INT PRIMARY KEY,
    FirstName NVARCHAR(25),
    LastName NVARCHAR(25),
    Gender NVARCHAR(10),
    Father_ID INT NULL,
    Mother_ID INT NULL,
    Spouse_ID INT NULL,
    FOREIGN KEY (Father_ID) REFERENCES People(ID),
    FOREIGN KEY (Mother_ID) REFERENCES People(ID),
    FOREIGN KEY (Spouse_ID) REFERENCES People(ID)
);
INSERT INTO People (ID, FirstName, LastName, Gender, Father_ID, Mother_ID, Spouse_ID)  
VALUES  
(1, N'Amos', N'Cohen', N'Male', NULL, NULL, NULL),  
(2, N'Hannah', N'Cohen', N'Female', NULL, NULL, NULL), 
(3, N'Yoel', N'Cohen', N'Male', 1, 2, NULL),  
(4, N'Avital', N'Cohen', N'Female', 1, 2, NULL),  
(5, N'Elkanah', N'Shapira', N'Male', NULL, NULL, NULL), 
(6, N'Miriam', N'Shapira', N'Female', NULL, NULL, NULL),  
(7, N'Shmuel', N'Shapira', N'Male', 5, 6, NULL),  
(8, N'Tamar', N'Shapira', N'Female', 5, 6, NULL);

UPDATE People SET Spouse_ID = 2 WHERE ID = 1;
UPDATE People SET Spouse_ID = 1 WHERE ID = 2;
UPDATE People SET Spouse_ID = 6 WHERE ID = 5;
UPDATE People SET Spouse_ID = 5 WHERE ID = 6;

CREATE TABLE FamilyTree (
    Person_Id INT,        
    Relative_Id INT,       
    Connection_Type NVARCHAR(20), 
    PRIMARY KEY (Person_Id, Relative_Id),
    FOREIGN KEY (Person_Id) REFERENCES People(ID),  
    FOREIGN KEY (Relative_Id) REFERENCES People(ID)  
);

-- Exercise 1
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
-- Add father-child connections
SELECT ID, Father_ID, 'Father' 
FROM People 
WHERE Father_ID IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM FamilyTree 
    WHERE Person_Id = People.ID 
    AND Relative_Id = People.Father_ID 
)
UNION ALL
-- Add mother-child connections
SELECT ID, Mother_ID, 'Mother' 
FROM People 
WHERE Mother_ID IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM FamilyTree 
    WHERE Person_Id = People.ID 
    AND Relative_Id = People.Mother_ID 
)
UNION ALL
-- Add spouse connections
SELECT S1.ID, S2.ID, 
    CASE 
        WHEN S1.Gender = 'Male' THEN 'Husband' 
        ELSE 'Wife' 
    END
FROM People S1
JOIN People S2 ON S1.Spouse_ID = S2.ID
WHERE S1.Spouse_ID IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM FamilyTree 
    WHERE Person_Id = S1.ID 
    AND Relative_Id = S2.ID 
)
UNION ALL
-- Add sibling connections
SELECT C1.ID, C2.ID, 
    CASE 
        WHEN C1.Gender = 'Male' THEN 'Brother' 
        ELSE 'Sister' 
    END AS Connection_Type
FROM People C1
JOIN People C2 
    ON C1.ID <> C2.ID 
    AND (C1.Father_ID = C2.Father_ID OR C1.Mother_ID = C2.Mother_ID)
WHERE NOT EXISTS (
    SELECT 1 FROM FamilyTree 
    WHERE Person_Id = C1.ID 
    AND Relative_Id = C2.ID 
)
UNION ALL
-- Add child-to-parent connections
SELECT P.ID, C.ID, 
    CASE 
        WHEN C.Gender = 'Male' THEN 'Son' 
        ELSE 'Daughter' 
    END
FROM People P
JOIN People C ON P.ID = C.Father_ID OR P.ID = C.Mother_ID
WHERE NOT EXISTS (
    SELECT 1 FROM FamilyTree 
    WHERE Person_Id = P.ID 
    AND Relative_Id = C.ID 
);


-- Exercise 2
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type)
SELECT P1.ID, P2.ID, 
       CASE WHEN P1.Gender = 'Male' THEN 'Husband' ELSE 'Wife' END
FROM People P1
JOIN People P2 ON P1.Spouse_ID = P2.ID
UNION ALL
SELECT P2.ID, P1.ID, 
       CASE WHEN P2.Gender = 'Male' THEN 'Husband' ELSE 'Wife' END
FROM People P1
JOIN People P2 ON P1.Spouse_ID = P2.ID
WHERE NOT EXISTS (
    SELECT 1 FROM FamilyTree FT 
    WHERE FT.Person_Id = P2.ID AND FT.Relative_Id = P1.ID
);
