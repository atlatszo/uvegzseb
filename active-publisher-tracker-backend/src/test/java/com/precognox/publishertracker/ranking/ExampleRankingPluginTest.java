package com.precognox.publishertracker.ranking;

import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Update;
import org.junit.Before;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ExampleRankingPluginTest {

    private ExampleRankingPlugin instance;

    @Before
    public void setUp() throws Exception {
        instance = new ExampleRankingPlugin();
    }

    @Test
    public void shouldNotThrowException_withNoData() throws Exception {
        List<RankingEntry> result = instance.getRanking(Collections.emptyList());

        assertTrue(result.isEmpty());
    }

    @Test
    public void shouldWork_withOneDataOwner_withNoUpdate() throws Exception {
        DataOwner dataOwner = setUpTestDataOwner();

        List<RankingEntry> result = instance.getRanking(Collections.singletonList(dataOwner));

        assertTrue(result.isEmpty());
    }

    private DataOwner setUpTestDataOwner() {
        DataOwner dataOwner = new DataOwner();
        dataOwner.setShortName(UUID.randomUUID().toString());
        dataOwner.setLongName(UUID.randomUUID().toString());
        dataOwner.setUuid(UUID.randomUUID().toString());
        dataOwner.setWeight(1);

        return dataOwner;
    }

    @Test
    public void shouldWork_withOneDocument_withNoProvidedDate() throws Exception {
        DataOwner dataOwner = setUpTestDataOwnerWithDocuments(1);

        List<RankingEntry> result = instance.getRanking(Collections.singletonList(dataOwner));

        assertEquals(1, result.size());
        assertEquals(dataOwner.getLongName(), result.get(0).getPublisherName());
        assertEquals(2.5, result.get(0).getScore(), 0.0);
    }

    private DataOwner setUpTestDataOwnerWithDocuments(int documentNum) {
        Update update = new Update();
        update.setDate(LocalDateTime.now().minusDays(1));
        update.setDocuments(new ArrayList<>());

        for (int i = 0; i < documentNum; i++) {
            Document document = new Document();
            update.getDocuments().add(document);
            document.setUpdate(update);
        }

        DataOwner dataOwner = setUpTestDataOwner();
        dataOwner.setUpdates(Collections.singletonList(update));
        update.setDataOwner(dataOwner);

        return dataOwner;
    }

    @Test
    public void testWithTwoPublishers() throws Exception {
        DataOwner publisher1 = setUpTestDataOwnerWithDocuments(2);
        DataOwner publisher2 = setUpTestDataOwnerWithDocuments(1);

        List<RankingEntry> result = instance.getRanking(Arrays.asList(publisher1, publisher2));

        assertEquals(2, result.size());

        assertEquals(publisher1.getLongName(), result.get(0).getPublisherName());
        assertEquals(5.0, result.get(0).getScore(), 0.0);

        assertEquals(publisher2.getLongName(), result.get(1).getPublisherName());
        assertEquals(0.0, result.get(1).getScore(), 0.0);
    }

    @Test
    public void testWithThreePublishers() throws Exception {
        DataOwner publisher1 = setUpTestDataOwnerWithDocuments(3);
        DataOwner publisher2 = setUpTestDataOwnerWithDocuments(2);
        DataOwner publisher3 = setUpTestDataOwnerWithDocuments(1);

        List<RankingEntry> result = instance.getRanking(Arrays.asList(publisher1, publisher2, publisher3));

        assertEquals(3, result.size());

        assertEquals(publisher1.getLongName(), result.get(0).getPublisherName());
        assertEquals(5.0, result.get(0).getScore(), 0.0);

        assertEquals(publisher2.getLongName(), result.get(1).getPublisherName());
        assertEquals(2.5, result.get(1).getScore(), 0.1);

        assertEquals(publisher3.getLongName(), result.get(2).getPublisherName());
        assertEquals(0.0, result.get(2).getScore(), 0.0);
    }

}
