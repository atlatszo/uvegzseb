package com.precognox.publishertracker.services;

import com.precognox.publishertracker.beans.RankingResult;
import com.precognox.publishertracker.ranking.RankingEntry;
import com.precognox.publishertracker.ranking.RankingPlugin;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

public class RankingServiceTest {

    private RankingService rankingService;

    private RankingPlugin mockRankingPlugin = mock(RankingPlugin.class);

    @Before
    public void setUp() throws Exception {
        reset(mockRankingPlugin);

        rankingService = new RankingService(mockRankingPlugin);

        List<RankingEntry> mockRanking = new ArrayList<>();
        mockRanking.add(new RankingEntry(2.75, "test-publisher1"));
        mockRanking.add(new RankingEntry(1.5, "test-publisher2"));
        mockRanking.add(new RankingEntry(3.4, "test-publisher3"));
        mockRanking.add(new RankingEntry(4.5, "test-publisher4"));
        mockRanking.add(new RankingEntry(5, "test-publisher5"));

        when(mockRankingPlugin.getRanking(anyObject())).thenReturn(mockRanking);
    }

    @Test
    public void testPaging() throws Exception {
        RankingResult result = rankingService.getRankings(0, 3);

        assertEquals(3, result.getRanking().size());
        assertEquals(5, result.getTotalCount());
    }

    @Test
    public void testPaging2() throws Exception {
        RankingResult result = rankingService.getRankings(99, 10);

        assertEquals(0, result.getRanking().size());
        assertEquals(5, result.getTotalCount());
    }

    @Test
    public void testPaging3() throws Exception {
        RankingResult result = rankingService.getRankings(0, 10);

        assertEquals(5, result.getRanking().size());
        assertEquals(5, result.getTotalCount());
    }

}