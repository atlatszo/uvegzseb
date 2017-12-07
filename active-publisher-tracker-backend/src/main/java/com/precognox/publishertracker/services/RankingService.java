package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.precognox.publishertracker.beans.RankingResult;
import com.precognox.publishertracker.entities.DataOwner;
import com.precognox.publishertracker.ranking.RankingEntry;
import com.precognox.publishertracker.ranking.RankingPlugin;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class RankingService {

    private final RankingPlugin rankingPlugin;

    private List<RankingEntry> cache;

    public RankingService(RankingPlugin rankingPlugin) {
        this.rankingPlugin = rankingPlugin;
    }

    public RankingResult getRankings(int start, int rows) {
        if (cache == null) {
            updateCache();
        }

        if (rows > 0) {
            if (start > cache.size()) {
                return new RankingResult(cache.size(), Collections.emptyList());
            }

            int end = start + rows;

            if (end > cache.size()) {
                end = cache.size();
            }

            return new RankingResult(cache.size(), cache.subList(start, end));
        }

        return new RankingResult(cache.size(), cache);
    }

    void updateCache() {
        cache = rankingPlugin.getRanking(Ebean.find(DataOwner.class).findList());
    }

    public int getPosition(String publisherName) {
        if (cache == null) {
            updateCache();
        }

        Optional<RankingEntry> entry =
                cache.stream().filter(e -> e.getPublisherName().equals(publisherName)).findFirst();

        return entry.map(rankingEntry -> cache.indexOf(rankingEntry) + 1).orElse(0);
    }

}
