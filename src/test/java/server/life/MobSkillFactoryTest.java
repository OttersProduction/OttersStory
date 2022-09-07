package server.life;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class MobSkillFactoryTest {

    @TempDir
    private Path wzPath;

    @BeforeEach
    void setWzPath() {
        MockitoAnnotations.openMocks(this);
        writeTestFileToTempDir();
        System.setProperty("wz-path", "%s/wz".formatted(wzPath.toString()));
    }

    private void writeTestFileToTempDir() {
        try {
            String testFileContents = readTestFileContents();
            writeTempDirFile(testFileContents);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String readTestFileContents() throws IOException {
        return new String(getClass()
                .getClassLoader()
                .getResourceAsStream("MobSkill-test.img.xml")
                .readAllBytes()
        );
    }

    private void writeTempDirFile(String fileContents) throws IOException {
        Path tempDirDirectory = wzPath.resolve("wz/Skill.wz");
        Files.createDirectories(tempDirDirectory);
        Path tempDirFile = Files.createFile(tempDirDirectory.resolve("MobSkill.img.xml"));
        Files.writeString(tempDirFile, fileContents);
    }

    @Test
    void shouldLoadExistingMobSkill() {
        MobSkill mobSkill = MobSkillFactory.getMobSkill(MobSkillType.ATTACK_UP, 1);

        assertNotNull(mobSkill);
        assertAll("MobSkill",
                () -> assertEquals(115, mobSkill.getX()),
                () -> assertEquals(5, mobSkill.getMpCon()),
                () -> assertEquals(40_000, mobSkill.getCoolTime()),
                () -> assertEquals(30_000, mobSkill.getDuration())
        );
    }

    @Test
    void shouldReturnNullForNonExistingMobSkill() {
        MobSkill mobSkill = MobSkillFactory.getMobSkill(MobSkillType.DEFENSE_UP, 1);

        assertNull(mobSkill);
    }

}